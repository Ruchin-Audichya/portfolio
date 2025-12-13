// @ts-nocheck
import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

// Mock GSAP
jest.mock('gsap', () => ({
    __esModule: true,
    default: {
        timeline: jest.fn(() => ({
            to: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
        })),
        context: jest.fn((callback, ref) => {
            callback();
            return { revert: jest.fn() };
        }),
    },
}));

// Mock content
jest.mock('@/lib/content', () => ({
    content: {
        profile: {
            name: 'Ruchin Audichya',
            headline: 'Full Stack Developer',
            resume: '/resume.pdf',
        },
    },
}));

describe('Hero Component', () => {
    it('renders without crashing', () => {
        render(<Hero />);
        expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
    });

    it('displays the name correctly', () => {
        render(<Hero />);
        expect(screen.getByText('RUCHIN')).toBeInTheDocument();
        expect(screen.getByText('AUDICHYA')).toBeInTheDocument();
    });

    it('displays the headline', () => {
        render(<Hero />);
        expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
    });

    it('renders download resume button', () => {
        render(<Hero />);
        const downloadButton = screen.getByText(/download resume/i);
        expect(downloadButton).toBeInTheDocument();
        expect(downloadButton.closest('a')).toHaveAttribute('href', '/resume.pdf');
        expect(downloadButton.closest('a')).toHaveAttribute('download');
    });

    it('has correct section structure', () => {
        const { container } = render(<Hero />);
        const section = container.querySelector('section');
        expect(section).toBeInTheDocument();
        expect(section).toHaveClass('h-screen');
    });

    it('contains animated elements', () => {
        const { container } = render(<Hero />);

        // Check for the streak line
        const streakLine = container.querySelector('.absolute.top-0.bottom-0');
        expect(streakLine).toBeInTheDocument();

        // Check for the orb
        const orb = container.querySelector('.rounded-full.border');
        expect(orb).toBeInTheDocument();
    });

    it('initializes GSAP animations on mount', () => {
        const gsap = require('gsap').default;
        render(<Hero />);

        expect(gsap.context).toHaveBeenCalled();
    });

    it('cleans up GSAP context on unmount', () => {
        const revertMock = jest.fn();
        const gsap = require('gsap').default;
        gsap.context.mockImplementation((callback) => {
            callback();
            return { revert: revertMock };
        });

        const { unmount } = render(<Hero />);
        unmount();

        expect(revertMock).toHaveBeenCalled();
    });
});
