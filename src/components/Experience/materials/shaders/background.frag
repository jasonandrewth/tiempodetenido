varying vec2 vUv;
uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uTextureDiffuse;
uniform sampler2D uTextureDiffuseNext;

float luminance(vec4 color) {
    return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

void main() {

    vec3 color = vec3(0.0, 0.0, 0.0);
    color = uColor;
    color.rg = vUv;
    vec2 smoothUV = smoothstep(0.0, 0.1, vUv);
    smoothUV *= vec2(smoothstep(0.0, 0.1, 1.0 - vUv));

    vec4 textureCurrent = texture2D(uTextureDiffuse, vUv);
    vec4 textureNext = texture2D(uTextureDiffuseNext, vUv);

    vec2 scaledUv = vUv * vec2(1.0);

    float luminanceDifference = abs(luminance(textureNext) - luminance(textureCurrent));

    vec2 colorDifferenceRG = textureNext.rg - textureCurrent.rg;
    vec2 direction = normalize(colorDifferenceRG + sin(uTime) * 0.5);

    //color1 in example touchdesigner
    scaledUv.rg += direction * (luminanceDifference * (sin(uTime) * 0.5 + 1.0) * smoothUV);

    // color.rg = scaledUv;
    scaledUv *= 0.05;

    // color.rgb = vec3(0.0);
    vec4 textureCurrentDisplaced = texture2D(uTextureDiffuse, vUv + scaledUv);
    vec4 textureNextDisplaced = texture2D(uTextureDiffuseNext, vUv + scaledUv);
    vec3 texNow = mix(textureCurrentDisplaced.rgb, textureNextDisplaced.rgb, (sin(uTime * 0.5) + 1.0) * 0.5);
    color.rgb = texNow.rgb;
    // color.rgb = vec3((sin(uTime) + 1.0) * 0.5);

    gl_FragColor = vec4(color, 0.3);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}