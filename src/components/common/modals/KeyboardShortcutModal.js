import { Modal, ModalFooter, ModalHeader } from 'components/common/Modal';
import React from 'react';

export default ({ onToggle }) => {
  return (
    <Modal size="lg" containerClass="overflow-auto bg-secondary" onToggle={onToggle}>
      <div className="p-8">
        <ModalHeader onToggle={onToggle}>Keyboard Shortcuts</ModalHeader>
        <div className="">
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4">
            <div>
              <div className="mb-2">
                <div className="mb-0 group-modal-title">Jump To</div>
                <div>
                  <kbd className="keyboard-key">g</kbd> , <kbd className="keyboard-key">h</kbd> Home
                </div>
                <div>
                  <kbd className="keyboard-key">g</kbd> , <kbd className="keyboard-key">l</kbd> Latest
                </div>
                <div>
                  <kbd className="keyboard-key">g</kbd> , <kbd className="keyboard-key">u</kbd> Unread
                </div>
                <div>
                  <kbd className="keyboard-key">g</kbd> , <kbd className="keyboard-key">c</kbd> Categories
                </div>
                <div>
                  <kbd className="keyboard-key">g</kbd> , <kbd className="keyboard-key">b</kbd> Bookmarks
                </div>
                <div>
                  <kbd className="keyboard-key">g</kbd> , <kbd className="keyboard-key">p</kbd> Profile
                </div>
                <div>
                  <kbd className="keyboard-key">g</kbd> , <kbd className="keyboard-key">m</kbd> Messages
                </div>
                <div>
                  <kbd className="keyboard-key">g</kbd> , <kbd className="keyboard-key">d</kbd> Drafts
                </div>
              </div>

              <div className="mb-2">
                <div className="mb-0 group-modal-title">Navigation</div>
                <div>
                  <kbd className="keyboard-key">u</kbd> Back
                </div>
                {/* <div>
                  <kbd className="keyboard-key">#</kbd> Go to reply # [dont have]
                </div> */}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <div className="mb-0 group-modal-title">Application</div>
                <div>
                  <kbd className="keyboard-key">=</kbd> Open hamburger menu
                </div>
                <div>
                  <kbd className="keyboard-key">/</kbd> Search
                </div>
                <div>
                  <kbd className="keyboard-key">?</kbd> Open keyboard help
                </div>
                <div>
                  <kbd className="keyboard-key">Shift</kbd> + <kbd className="keyboard-key">z</kbd> Sign Out
                </div>
              </div>

              <div className="mb-2">
                <div className="mb-0 group-modal-title">Composing</div>
                <div>
                  <kbd className="keyboard-key">c</kbd> Create a new topic
                </div>
                {/* <div>
                  <kbd className="keyboard-key">Shift</kbd> + <kbd className="keyboard-key">r</kbd> Reply to topic [dont
                  have]
                </div> */}
              </div>
            </div>
            <div>
              <div className="mb-2">
                <div className="mb-0 group-modal-title">Actions</div>
                <div>
                  <kbd className="keyboard-key">Shift</kbd> + <kbd className="keyboard-key">p</kbd> [Admin only] Pin/
                  Unpin topic
                </div>
                <div>
                  <kbd className="keyboard-key">Shift</kbd> + <kbd className="keyboard-key">s</kbd> Share topic
                </div>
                <div>
                  <kbd className="keyboard-key">Shift</kbd> + <kbd className="keyboard-key">a</kbd> Open Topic Action
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalFooter>
          <button className="ml-3 btn btn-outline" onClick={() => onToggle(false)}>
            OK
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
};
