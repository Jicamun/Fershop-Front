import React from "react";
import { pinCheck } from "./../hooks/usePinCheck"

const PinCheck = () => {
  const { pinCheck, isLoading, error } = pinCheck();

  const handlePinCheck = async () => {
    console.log("handlePinCheck")
    const pin = '1234'; // Aquí debes obtener el PIN del usuario
    const email = 'user@example.com'; // Aquí debes obtener el correo electrónico del usuario

    pinCheck(pin, email);
  };

  return (
    <div>
      {/* Aquí puedes renderizar tu interfaz de usuario y manejar la lógica según sea necesario */}
      <button onClick={handlePinCheck} disabled={isLoading}>
        Check PIN
      </button>

      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PinCheck;