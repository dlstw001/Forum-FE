import { Preview } from 'components/common/Form/Editor';
import CreateMessageModal from 'components/common/modals/CreateMessageModal';
import Popover from 'react-popover-selector';
import React from 'react';

import { clearSelection } from 'utils';
import { inject, observer } from 'mobx-react';
import transform from 'components/Topics/transform';
import useClickCount from 'hooks/useClickCount';
import useMention from 'hooks/useMention';
import UserPopover from 'components/common/UserPopover';
import useToggle from 'hooks/useToggle';

const ReplyContent = (props) => {
  const { data: _data, userStore, value, className, setQuote } = props;
  const ref = React.useRef(null);
  const [content, setContent] = React.useState();
  const [user, setUser] = React.useState();
  const { toggle, handleToggle } = useToggle({
    userPopover: false,
    quotePopover: false,
  });
  const buttonRef = React.useRef(null);

  useClickCount(ref, _data._id, content);
  useMention({
    content,
    buttonRef,
    ref,
    onClick: (e) => {
      setUser(e.target.innerText.replace('@', '').trim());
      buttonRef.current = e.target;
      handleToggle({ userPopover: true });
    },
  });

  React.useEffect(() => {
    const process = async () => {
      const res = await transform(value);
      setContent(res);
    };
    process();
  }, [value]);

  const onQuoteSelect = () => {
    setQuote(
      `[quote="${_data.creator.displayName}, post:${_data.post._id}, reply:${_data._id}"]${window
        .getSelection()
        .toString()}[/quote]\n`
    );
    clearSelection();
    handleToggle({ quotePopover: false });
  };

  return (
    <>
      {userStore.user && (
        <Popover
          selectionRef={ref}
          isOpen={toggle.quotePopover}
          className="quote-field-btn"
          onTextSelect={() => {
            if (window.getSelection().getRangeAt(0).toString().trim().length > 0) {
              handleToggle({ quotePopover: true });
            }
          }}
          onTextUnselect={() => {
            handleToggle({ quotePopover: false });
          }}
        >
          <button onClick={onQuoteSelect}>
            <i className="material-icons">format_quote</i>
            Quote
          </button>
        </Popover>
      )}

      <div ref={ref}>
        {content && (
          <div
            className={className}
            onMouseUp={() => {
              if (
                window.getSelection().length > 0 &&
                window.getSelection().getRangeAt(0).toString().trim().length > 0
              ) {
                handleToggle({ quotePopover: true });
              }
            }}
          >
            <Preview data={content} />
          </div>
        )}
      </div>
      {toggle.userPopover && (
        <UserPopover
          onToggleMessage={() => handleToggle({ createMessage: !toggle.createMessage })}
          user={user}
          onClose={() => handleToggle({ userPopover: false })}
          buttonRef={buttonRef}
        />
      )}

      {toggle.createMessage && (
        <CreateMessageModal
          onToggle={(show) => handleToggle({ createMessage: show || !toggle.createMessage })}
          toUser={user}
        />
      )}
    </>
  );
};

export default inject(({ userStore }) => ({ userStore }))(observer(ReplyContent));
