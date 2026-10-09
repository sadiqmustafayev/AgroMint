import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploadZone } from '../src/components/shared/FileUploadZone';

describe('FileUploadZone Component', () => {
  it('displays helper text for accepted document formats', () => {
    render(
      <FileUploadZone
        label="Upload Soil Analysis PDF"
        description="Attach lab sheets or soil reports"
        acceptedTypes={['pdf', 'jpg', 'png']}
        onFilesSelected={() => {}}
      />
    );
    expect(screen.getByText(/Upload Soil Analysis PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/PDF, JPG, PNG/i)).toBeInTheDocument();
  });

  it('handles simulated file upload selection', () => {
    const handleFiles = vi.fn();
    render(
      <FileUploadZone
        label="Plant Photos"
        acceptedTypes={['jpg', 'png']}
        onFilesSelected={handleFiles}
      />
    );

    const input = screen.getByLabelText(/Plant Photos/i);
    const testFile = new File(['dummy content'], 'leaf-lesion.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [testFile] } });

    expect(handleFiles).toHaveBeenCalled();
  });
});
