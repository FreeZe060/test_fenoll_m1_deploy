import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
    test('check counter on click me button', () => {
        render(<App />);
        const button = screen.getByRole('button', { name: /click me/i });
        const counter = screen.getByTestId('count');
        expect(button).toBeInTheDocument();
        expect(counter).toBeInTheDocument();
        expect(counter).toHaveTextContent("0");
        fireEvent.click(button);
        expect(counter).toHaveTextContent("1");
    });
});
