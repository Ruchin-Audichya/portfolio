import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Overlay } from '@/components/Overlay';
import '@testing-library/jest-dom';

describe('Overlay Component', () => {
    const mockOnClose = jest.fn();

    it('renders nothing when activeId is null', () => {
        const { container } = render(<Overlay activeId={null} onClose={mockOnClose} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders content when activeId is provided', () => {
        render(<Overlay activeId="journey" onClose={mockOnClose} />);
        expect(screen.getByText(/My Journey/i)).toBeInTheDocument();
        expect(screen.getByText(/Ruchin's world/i)).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<Overlay activeId="journey" onClose={mockOnClose} />);
        const closeBtn = screen.getByLabelText(/Close overlay/i);
        fireEvent.click(closeBtn);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
        render(<Overlay activeId="journey" onClose={mockOnClose} />);
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(mockOnClose).toHaveBeenCalled();
    });
});
