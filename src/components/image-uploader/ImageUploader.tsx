import React, { useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { setShowAlert } from "../../redux/meta/slice";

export const ImageUploader = ({
  setSelectedFile,
  setPreviewUrl,
  error,
}: {
  setSelectedFile: (file: any) => void;
  setPreviewUrl: (prev: string) => void;
  error?: any;
}) => {
  const [showError, setShowError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file:any = e.target.files?.[0] || null;
    if (file && file.size < 2000000) {
      setShowError("");
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file?.name);
    }else{
      setShowError( 
       "Size is too large, Please Select small image",
      )
    };  
    
  };
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  
  return (
    <>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <VisuallyHiddenInput type="file" />
      </Button>
    
      {error || showError ? <p className="error-text">{error || showError}</p> : null}
    </>
  );
};
