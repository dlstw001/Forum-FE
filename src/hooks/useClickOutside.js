import React from 'react';

export default ({ onClose, elemRef }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const handleDocumentClick = React.useCallback(
    (event) => {
      if (isMounted) {
        if (!elemRef.current.contains(event.target)) {
          onClose();
        }
      }
    },
    [elemRef, isMounted, onClose]
  );

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClick, false);
    setIsMounted(true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
    };
  }, [handleDocumentClick]);
};
