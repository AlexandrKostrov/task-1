const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    if(color[1]==="F" || color[1]==="E") {
        getRandomColor();
    }
    return color;
  }

  module.exports = getRandomColor;