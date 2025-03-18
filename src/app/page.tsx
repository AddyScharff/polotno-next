'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Modal from 'react-modal';

// we MUST load the editor dynamically, otherwise server-side rendering will fail
const Editor = dynamic(() => import('../components/editor'), {
  ssr: false,
});


export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>Open Editor</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Editor Modal"
        ariaHideApp={false}
      >
        <button onClick={closeModal}>Close</button>
        <Editor />
      </Modal>
    </div>
  );
}
