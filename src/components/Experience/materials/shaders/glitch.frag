varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform vec4 uRes;
uniform sampler2D uTextureDiffuse;
uniform sampler2D uTextureDiffuseNext;
uniform sampler2D uTextureFeedback;

float luminance(vec4 color) {
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

void main() {

    vec2 uv = vUv;

    vec2 aspectUv = (vUv - vec2(0.5)) * uRes.zw + vec2(0.5);

    vec3 color = vec3(0.0, 0.0, 0.0);
    color = uColor;
    color.rg = vUv;
    vec2 smoothUV = smoothstep(0.0, 0.1, vUv);
    smoothUV *= vec2(smoothstep(0.0, 0.1, 1.0 - aspectUv));

    vec4 textureCurrent = texture2D(uTextureDiffuse, aspectUv);
    vec4 textureNext = texture2D(uTextureDiffuseNext, aspectUv);

    vec2 scaledUv = vUv * vec2(1.0);

    float luminanceDifference = abs(luminance(textureNext) - luminance(textureCurrent));

    vec2 colorDifferenceRG = textureNext.rg - textureCurrent.rg;
    vec2 direction = normalize(colorDifferenceRG + sin(uTime) * 0.5);

    //color1 in example touchdesigner
    scaledUv.rg += direction * (luminanceDifference * (sin(uTime) * 0.5 + 1.0) * smoothUV);

    // color.rg = scaledUv;
    scaledUv *= 0.05;

    // color.rgb = vec3(0.0);
    vec4 textureCurrentDisplaced = texture2D(uTextureDiffuse, aspectUv + scaledUv);
    vec4 textureNextDisplaced = texture2D(uTextureDiffuseNext, aspectUv + scaledUv);
    vec3 texNow = mix(textureCurrentDisplaced.rgb, textureNextDisplaced.rgb, (sin(uTime * 0.5) + 1.0) * 0.5);
    color.rgb = texNow.rgb;
    color.rgb = textureCurrent.rgb;

    // Blend with the previous frame
    vec4 previousFrame = texture2D(uTextureFeedback, vUv);
    vec3 blendedOutput = mix(color, previousFrame.rgb, 0.7); 

    // color.rgb = vec3((sin(uTime) + 1.0) * 0.5);
    // color.rgb = vec3(1.0, 0.0, 0.0);
    // color.rg = vUv;
    // color.b = 0.0;

    gl_FragColor = vec4(color, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}