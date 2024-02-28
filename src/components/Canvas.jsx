import React, { useState, useRef } from "react";

const Canvas = () => {
  const [textObjects, setTextObjects] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const canvasRef = useRef(null);
  const draggingItem = useRef(null);

  const handleAddTextBox = () => {
    const newTextObject = {
      id: textObjects.length + 1,
      //   text: "New Text",
      position: { x: 0, y: 0 }, // Initial position
    };
    setTextObjects([...textObjects, newTextObject]);
    addToUndoStack(newTextObject, "add");
  };

  const handleMoveStart = (e, id) => {
    draggingItem.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
    };
  };

  const handleMoveTextBox = (e) => {
    if (draggingItem.current) {
      const dx = e.clientX - draggingItem.current.startX;
      const dy = e.clientY - draggingItem.current.startY;

      const updatedTextObjects = textObjects.map((obj) =>
        obj.id === draggingItem.current.id
          ? {
              ...obj,
              position: { x: obj.position.x + dx, y: obj.position.y + dy },
            }
          : obj
      );

      setTextObjects(updatedTextObjects);
      draggingItem.current.startX = e.clientX;
      draggingItem.current.startY = e.clientY;
    }
  };

  const handleMoveEnd = () => {
    draggingItem.current = null;
  };

  const handleTextChange = (id, newText) => {
    const updatedTextObjects = textObjects.map((obj) =>
      obj.id === id ? { ...obj, text: newText } : obj
    );
    setTextObjects(updatedTextObjects);
  };

  const addToUndoStack = (item, action) => {
    setUndoStack([...undoStack, { item, action }]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastAction = undoStack.pop();
      setRedoStack([...redoStack, lastAction]);
      applyAction(lastAction, true);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const lastAction = redoStack.pop();
      setUndoStack([...undoStack, lastAction]);
      applyAction(lastAction, false);
    }
  };

  const applyAction = (action, reverse) => {
    switch (action.action) {
      case "add":
        if (reverse) {
          setTextObjects(
            textObjects.filter((obj) => obj.id !== action.item.id)
          );
        } else {
          setTextObjects([...textObjects, action.item]);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <button onClick={handleAddTextBox}>Add Text Box</button>
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleRedo}>Redo</button>
      <div
        ref={canvasRef}
        style={{
          width: "500px",
          height: "500px",
          border: "1px solid black",
          position: "relative",
        }}
        onMouseMove={handleMoveTextBox}
        onMouseUp={handleMoveEnd}
      >
        {textObjects.map((obj) => (
          <div
            key={obj.id}
            style={{
              position: "absolute",
              left: obj.position.x,
              top: obj.position.y,
            }}
            onMouseDown={(e) => handleMoveStart(e, obj.id)}
          >
            <textarea
              type="text"
              value={obj.text}
              onChange={(e) => handleTextChange(obj.id, e.target.value)}
              placeholder="New Text"
              onFocus={handleMoveEnd}
            ></textarea>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
