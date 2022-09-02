import { last } from 'lodash';
import { useForm } from 'react-hook-form';
import ConversationItem from './ConversationItem';
import cx from 'classnames';
import React from 'react';
import useToggle from 'hooks/useToggle';

const initialValue = () => ({
  id: 1,
  title: 'Hi, I am Tim. What can I help you today?',
  type: 'options',
  isSelected: false,
  options: [
    { title: 'Become Peplink Partners' },
    { title: 'Purchase' },
    { title: 'Training', disabled: true },
    { title: 'Sign Up as Peplink Certified Engieer', disabled: true },
    { title: 'Others', disabled: true },
  ],
});

export default () => {
  const methods = useForm();
  const { handleSubmit, register, reset } = methods;
  const { toggle, handleToggle } = useToggle({ isOpen: false });
  const [conversation, setConversation] = React.useState([]);
  const ref = React.useRef();

  // useClickOutside({ onClose: () => handleToggle({ isOpen: false }), elemRef: ref });

  React.useEffect(() => {
    if (!conversation.length) {
      setConversation([initialValue()]);
    }
  }, [conversation]);

  const handleAnswer = React.useCallback((item) => {
    setConversation((prevState) => [...prevState, item]);
  }, []);

  const handleReset = React.useCallback(() => {
    setConversation([]);
  }, []);

  const handlePrevious = React.useCallback(() => {
    const newConversation = conversation.slice(0, conversation.length - 2);
    const lastItem = last(newConversation);
    lastItem.isSelected = false;
    setConversation(newConversation);
  }, [conversation]);

  const onSave = ({ message }) => {
    const payload = { message, type: 'message' };

    handleAnswer(payload);
    reset();
  };

  return (
    <div ref={ref} className="chatbot">
      <div className="text-center">
        <div className="flex flex-col items-center py-2">
          <div className="asktim-title">Ask Tim</div>
          <div className="asktim-title-arrow"></div>
        </div>
        <button
          onClick={() => handleToggle({ isOpen: !toggle.isOpen })}
          className="w-20 h-20 rounded-full shadow-lg bg-secondary"
        >
          <i className="icon-chatbot"></i>
        </button>
      </div>
      <div className={cx('chatbot-main', { hidden: !toggle.isOpen }, { flex: toggle.isOpen })}>
        <div className="chatbot-header">
          <div className="w-8 h-8 pb-1 mr-2 bg-white rounded-full">
            <i className="icon-chatbot"></i>
          </div>
          Ask Tim
          <button
            onClick={() => handleToggle({ isOpen: !toggle.isOpen })}
            className="ml-auto material-icons text-primary"
          >
            remove
          </button>
        </div>
        <div className="h-full p-4 pb-40 overflow-auto">
          <ul className="conversation">
            {conversation.map((i, key) => {
              return (
                <ConversationItem
                  conversation={conversation}
                  onPrevious={handlePrevious}
                  onReset={handleReset}
                  key={key}
                  data={i}
                  onAnswer={handleAnswer}
                />
              );
            })}
          </ul>
        </div>
        <form autoComplete="off" className="flex" onSubmit={handleSubmit(onSave)}>
          <input
            name="message"
            type="text"
            ref={register()}
            className="flex-grow px-4 border-0 rounded-none"
            placeholder="Type Your Question ..."
          />
          <button className="btn btn-primary">Send</button>
        </form>
      </div>
    </div>
  );
};
