//main();
//function main() {
  const canvas = document.querySelector('#glCanvas');

  const gl = canvas.getContext('webgl');

  if(!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    //return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
//}

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

  function initBuffers(gl) {
    //create a buffer for the square's positions
    const positionBuffer = gl.createBuffer();

    //select the positionBuffer as the one to apply buffer operations to from here out
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    //create an array of positions for the square
    const positions = [
      1.0, 1.0, -1.0, 1.0,
      1.0, -1.0, -1.0, -1.0
    ];

    //build the shape
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions),
      gl.STATIC_DRAW);

    return {
      position: positionBuffer
    };
  }

  function drawScene(gl, programInfo, buffers) {
    //clear to black
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //clear everything
    gl.clearDepth(1.0);
    //enable depth test
    gl.enable(gl.DEPTH_TEST);
    //near things obscure far things
    gl.depthFunc(gl.LEQUAL);

    //clear the canvas before drawing on it
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;

      const offset = 0;

      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);

      gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition
      );

      //tell webgl to use our program to draw
      gl.useProgram(programInfo.program);

      //set the shader uniforms
      gl.uniformMatrix4fv(
        programINfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);

      gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix); {
        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
      }
    }
  }
