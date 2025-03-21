import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const divs = Array(100).fill(0);

  //=====State mangement ===========

  const [color, setColor] = useState(
    Array(100)
      .fill()
      .map(() => Array(100).fill(""))
  );

  const [drawing, setDrawing] = useState(false);
  const [rightClickCoordenates, setRightClickCoordenates] = useState({
    x: 0,
    y: 0,
  });
  const [chosenColor, setChosenColor] = useState("red");
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuHidden, setMenuHidden] = useState(false);
  //=====Handlers====
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setDrawing(true);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };
  const handleMouseOver = (colIndex, rowIndex) => {
    if (drawing) {
      handleColor(colIndex, rowIndex);
    }
  };
  const handleColor = (colIndex, rowIndex) => {
    const auxColor = [...color];
    auxColor[colIndex] = [...auxColor[colIndex]];
    auxColor[colIndex][rowIndex] = auxColor[colIndex][rowIndex]
      ? ""
      : chosenColor;
    setColor(auxColor);
  };

  const handleClick = (colIndex, rowIndex) => {
    handleColor(colIndex, rowIndex);
  };

  const handleChangeColor = (color) => {
    setChosenColor(color);
    setMenuVisible(false);
    setTimeout(() => {
      setMenuHidden(false);
    }, 500);
  };

  const handleMenuMouseLeave = () => {
    setMenuVisible(false);
    setTimeout(() => {
      setMenuHidden(false);
    }, 500);
  };

  //==============
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      setMenuHidden(true);
      setRightClickCoordenates({ x: e.clientX, y: e.clientY });
      requestAnimationFrame(() => {
        setMenuVisible(true);
      });
    };
    window.addEventListener("contextmenu", handleContextMenu);
    const calculateGrid = () => {
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;
      const cellWidth = Math.round(screenWidth / 100);
      const possibleRows = Math.floor(screenHeight / cellWidth);

      setColor(
        Array(100)
          .fill()
          .map(() => Array(possibleRows).fill(""))
      );
    };

    calculateGrid();

    window.addEventListener("resize", calculateGrid);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("resize", calculateGrid);
    };
  }, []);

  return (
    <React.Fragment>
      {menuHidden && (
        <div
          className={`menu ${menuVisible ? "visible" : ""}`}
          style={{
            top: rightClickCoordenates.y,
            left: rightClickCoordenates.x,
          }}
          onMouseLeave={handleMenuMouseLeave}
        >
          <div
            className="menu-item red"
            onClick={() => handleChangeColor("red")}
          ></div>
          <div
            className="menu-item blue"
            onClick={() => handleChangeColor("blue")}
          ></div>
          <div
            className="menu-item yellow"
            onClick={() => handleChangeColor("yellow")}
          ></div>
          <div
            className="menu-item green"
            onClick={() => handleChangeColor("green")}
          ></div>
          <div
            className="menu-item orange"
            onClick={() => handleChangeColor("orange")}
          ></div>
        </div>
      )}

      <div className="col">
        {divs.map((_, colIndex) => {
          return (
            <div className="row" key={`row-${colIndex}`}>
              {color[colIndex].map((color, rowIndex) => (
                <div
                  key={`cell-${colIndex}-${rowIndex}`}
                  onClick={() => handleClick(colIndex, rowIndex)}
                  className={color}
                  onMouseDown={(e) => handleMouseDown(e)}
                  onMouseUp={handleMouseUp}
                  onMouseOver={() => handleMouseOver(colIndex, rowIndex)}
                ></div>
              ))}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default App;
