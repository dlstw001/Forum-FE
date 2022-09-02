import Lightbox from 'react-image-lightbox'; // This only needs to be imported once in your app
import React from 'react';
import useToggle from 'hooks/useToggle';

export default ({ children, isEditor }) => {
  const elementsContainer = React.useRef(null);
  const mutationRef = React.useRef();
  const [photoIndex, setPhotoIndex] = React.useState(0);
  const [images, setImages] = React.useState([]);
  const { toggle, handleToggle } = useToggle({
    lightbox: false,
  });

  React.useEffect(() => {
    const handleWrapper = (content) => {
      if (isEditor) {
        content.querySelectorAll('.resizer img').forEach((i, key) => {
          i.setAttribute('elementid', key);
        });
      } else {
        let srcs = [];
        content.querySelectorAll('img').forEach((i, key) => {
          srcs = [...srcs, i.src];
          i.setAttribute('loading', 'lazy');
          i.addEventListener('click', () => {
            i.setAttribute('elementid', key);

            setPhotoIndex(key);
            handleToggle({ lightbox: true });
          });
        });
        setImages(srcs);
      }
    };

    mutationRef.current = new MutationObserver(detectChanges);
    function detectChanges() {
      // if this runs there has been a mutation
      if (elementsContainer.current) {
        handleWrapper(elementsContainer.current);
      }
    }

    /* OBSERVE THE MUTATION */
    mutationRef.current.observe(elementsContainer.current, {
      childList: true,
      subtree: true,
      attributeFilter: ['href', 'src'],
    });

    handleWrapper(elementsContainer.current);
  }, [handleToggle, isEditor]);

  return (
    <div ref={elementsContainer}>
      {children}

      {toggle.lightbox && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => handleToggle({ lightbox: false })}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
        />
      )}
    </div>
  );
};
