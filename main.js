const vertexShaderText = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;

const fragmentShaderText = `
    precision mediump float;
    varying vec3 fragColor;

    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;


onload = () => {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");
    
    if (!gl) {
       console.log("WebGL not supported, falling back on experimental-webgl");
       gl = canvas.getContext("experimental-webgl");
    }
    
    if (!gl) {
       alert("Your browser does not support WebGL");
    }
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(`ERROR compiling vertex shader! ${gl.getShaderInfoLog(vertexShader)}`);
        return;
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(`ERROR compiling vertex shader! ${gl.getShaderInfoLog(fragmentShader)}`);
        return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`ERROR linking program! ${gl.getProgramInfoLog(program)}`);
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error(`ERROR validating program! ${gl.getProgramInfoLog(program)}`);
        return;
    }

    const triangleVertices = [
    //  X,    Y,      R,   G,   B
        0.0,  0.5,    1.0, 1.0, 0.0,
        -0.5, -0.5,   0.7, 0.0, 1.0,
        0.5,  -0.5,   0.1, 1.0, 0.6
    ]

    const triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
    gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};


