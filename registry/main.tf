terraform {
    required_providers {
      aws = {
        source = "hashicorp/aws"
        version = "~> 5.92"
      }
    }
    required_version = ">= 1.2"
}

provider "aws" {
    region = "eu-west-3"
}

data "aws_ami" "ubuntu" {
    most_recent = true
    filter {
        name = "name"
        values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
    }
    owners = ["099720109477"]
}

resource "tls_private_key" "pk" {
    algorithm = "RSA"
    rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
    key_name   = "registry-key-terraform"
    public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
    content  = tls_private_key.pk.private_key_pem
    filename = "${path.module}/registry-key-terraform.pem"
    file_permission = "0400"
}

resource "aws_security_group" "registry_sg" {
    name        = "registry-sg-simple"
    description = "Allow SSH, HTTP and HTTPS for Docker Registry"

    ingress {
        description = "SSH"
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "HTTPS - Docker Registry"
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "HTTP - Registry UI"
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

# 4. Instance EC2
resource "aws_instance" "registry_server" {
    ami           = data.aws_ami.ubuntu.id
    instance_type = "t3.micro"
    key_name      = aws_key_pair.generated_key.key_name

    vpc_security_group_ids = [aws_security_group.registry_sg.id]

    root_block_device {
        volume_size = 20
        volume_type = "gp3"
    }

    user_data = <<-EOF
        #!/bin/bash
        # Swap 2Go
        fallocate -l 2G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab

        # Docker
        apt-get update -y
        apt-get install -y docker.io
        systemctl start docker
        systemctl enable docker

        # Nexus avec limite mémoire
        docker run -d \
          --name nexus \
          --restart unless-stopped \
          -p 8081:8081 \
          -p 5000:5000 \
          -e INSTALL4J_ADD_VM_PARAMS="-Xms256m -Xmx512m -XX:MaxDirectMemorySize=512m" \
          sonatype/nexus3
    EOF

    tags = {
        Name = "Terraform-Registry-Server"
    }
}

# 5. Output (Pour récupérer l'IP facilement)
output "instance_ip" {
    value = aws_instance.registry_server.public_ip
}