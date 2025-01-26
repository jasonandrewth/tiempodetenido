attribute vec2 uvref;
attribute float aSize;

uniform float uTime;
uniform float uSize;
uniform vec2 uRes;
uniform sampler2D uTextureDepth;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 newpos = position;

      // Final position
    vec4 modelPosition = modelMatrix * vec4(newpos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

}
