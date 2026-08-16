// components/ConfirmDialog.jsx
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  const dialogStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    minWidth: '300px'
  }

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999
  }

  const buttonStyle = {
    margin: '0 10px',
    padding: '8px 16px',
    cursor: 'pointer'
  }

  return (
    <>
      <div style={overlayStyle} onClick={onCancel} />
      <div style={dialogStyle}>
        <p>{message}</p>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button style={buttonStyle} onClick={onConfirm}>
            Yes
          </button>
          <button style={buttonStyle} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfirmDialog
