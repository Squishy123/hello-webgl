  // Vertex Shader Program
  const vsSource = `
  attribute vec4 aVertexPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }`;

  //Fragment Shader Program
  const fsSource = `
void main() {
  gl_FragColor = vect4(1.0, 1.0, 1.0, 1.0);
}
`;

  //Initialize the shader program so WebGL knows how to draw our data
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    //Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    //if creating shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
      return null;
    }

    return shaderProgram;
  }

  //create a shader of the given type, unloads the source and compiles it
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    //send source to the shader object
    gl.shaderSource(shader, source);

    //compile the shader program
    gl.compileShader(shader);

    //check for compilation success
    if (!gl.getShaderParameter(shader, gl.COMPLE_STATUS)) {
      alert(`An error occured while compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  //create a new shaderProgram
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  //program info
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    }
  };
