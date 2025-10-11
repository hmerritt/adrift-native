// Vertex shader to render a fullscreen triangle pair (a quad)
export const VERTEX_SHADER_SOURCE = `#version 300 es
    // An attribute is an input to a vertex shader.
    // In this case, it's the position of a vertex.
    in vec2 a_position;

    void main() {
        // gl_Position is a special variable that holds the final position.
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

// Shadertoy uniform inputs and a main function that calls the shader code
export const FRAGMENT_SHADER_TEMPLATE = `#version 300 es
    precision highp float;

    // The final output color of the fragment.
    out vec4 fragColor;

    // Uniforms (global variables passed from JavaScript to the shader)
    uniform vec3 iResolution;
    uniform float iTime;
    uniform float iTimeDelta;
    uniform int iFrame;
    uniform vec4 iMouse;
    uniform vec4 iDate;
    uniform float iFrameRate;
    // Note: iChannel uniforms are declared but not used in this example.
    uniform sampler2D iChannel0;
    uniform sampler2D iChannel1;
    uniform sampler2D iChannel2;
    uniform sampler2D iChannel3;

    // --- ShaderToy Code Placeholder ---
    // The fetched GLSL code will be injected here.
    // It is expected to provide a 'mainImage' function.
    {{mainImageShader}}

    void main() {
        // Call the 'mainImage' function from the injected code.
        mainImage(fragColor, gl_FragCoord.xy);
        fragColor.a = 1.0;
    }
`;
