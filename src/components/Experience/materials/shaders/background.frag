#define M_PI 3.14159265358979323846

//	Simplex 3D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

// Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

  //  x0 = x0 - 0. + 0.0 * C 
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
    float n_ = 1.0 / 7.0; // N=7
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

//Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

// Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

varying vec2 vUv;
uniform float uTime;
uniform float uProgress;
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
    vec2 smoothUV = smoothstep(0.0, 0.1, aspectUv);
    smoothUV *= vec2(smoothstep(0.0, 0.1, 1.0 - aspectUv));

    vec4 textureCurrent = texture2D(uTextureDiffuse, aspectUv);
    vec4 textureNext = texture2D(uTextureDiffuseNext, aspectUv);

    vec2 scaledUv = vUv * vec2(1.0);

    float luminanceDifference = abs(luminance(textureNext) - luminance(textureCurrent));

    vec2 colorDifferenceRG = textureNext.rg - textureCurrent.rg;
    vec2 noiseVal = vec2(snoise(vec3(100.0, 100.0, uTime * 0.2)), snoise(vec3(80.0, 80.0, uTime * 0.25)));
    vec2 direction = normalize(colorDifferenceRG + 0.4 * noiseVal);

    //progress anim
    float noiseOrigin = snoise(vec3(vUv, uTime * 0.2));
    float noise = smoothstep(-1.0, 1.0, noiseOrigin);

    float duration = 0.4;
    float delay = (1.0 - duration);
    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress);

//color1 in example touchdesigner
    scaledUv.rg += direction * (luminanceDifference * (sin(uTime) * 0.5 + 1.0) * smoothUV);
    // scaledUv.rg += direction * (luminanceDifference * max(0.5, progress) * smoothUV);

    // color.rg = scaledUv;
    scaledUv *= luminanceDifference * 0.22;

    // color.rgb = vec3(0.0);
    vec4 textureCurrentDisplaced = texture2D(uTextureDiffuse, aspectUv + scaledUv);
    vec4 textureNextDisplaced = texture2D(uTextureDiffuseNext, aspectUv + scaledUv);

    color.rgb = textureCurrent.rgb;

    // Blend with the previous frame
    vec2 animatedUv = vUv;
    animatedUv -= 0.005 * vec2(cos(uTime * 0.5), sin(uTime));
    // animatedUv *= 1.01;
    vec4 previousFrame = texture2D(uTextureFeedback, vUv + scaledUv);
    vec3 blendedOutput = mix(color, previousFrame.rgb, 0.7);

    // color.rgb = vec3((sin(uTime) + 1.0) * 0.5);
    // color.rgb = vec3(1.0, 0.0, 0.0);

    // color = mix(textureCurrent.rgb, previousFrame.rgb, 0.9);
    color = mix(textureCurrent.rgb, textureNext.rgb, uProgress);

    vec3 texNow = mix(textureCurrentDisplaced.rgb, textureNextDisplaced.rgb, progress);
    // texNow = mix(textureCurrent.rgb, textureNext.rgb, uProgress);

    color.rgb = texNow.rgb;

    color.rg = scaledUv;
    color.b = 0.0;

    color.rgb = texNow.rgb;
    color.rgb = mix(color, previousFrame.rgb, 0.7);

    // color = mix(textureCurrent.rgb, previousFrame.rgb, 0.8);

    float luminanceDifferenceX = abs(luminance(previousFrame) - luminance(textureCurrent));
    color.rgb = vec3(luminanceDifference);

    vec2 ydisplace1 = vec2(aspectUv.x + uProgress * direction.x * (luminanceDifference * smoothUV.x) * 0.2, aspectUv.y + uProgress * direction.y * (luminanceDifference * smoothUV.y) * 0.2);
    vec2 ydisplace2 = vec2(aspectUv.x + (1.0 - uProgress) * direction.x * (luminanceDifference * smoothUV.x) * 0.2, aspectUv.y + (1.0 - uProgress) * direction.y * (luminanceDifference * smoothUV.y) * 0.2);
    vec4 t1 = texture2D(uTextureDiffuse, ydisplace1);
    vec4 t2 = texture2D(uTextureDiffuseNext, ydisplace2);
    vec4 t2Feed = texture2D(uTextureFeedback, ydisplace2);

    color = mix(t1.rgb, t2.rgb, uProgress);

    color.rgb = vec3(luminanceDifference);
    color.rgb = mix(t1.rgb, t2.rgb, progress);
    // color.rgb = mix(color, previousFrame.rgb, 0.4);

    // color.rgb = mix(texture2D(uTextureDiffuse, aspectUv), texture2D(uTextureDiffuseNext, aspectUv), uProgress).rgb;

    // dream like
    animatedUv = vUv;
    // animatedUv -= 0.005 * vec2(cos(uTime * 0.5), sin(uTime));
    animatedUv *= 1.01;
    previousFrame = texture2D(uTextureFeedback, animatedUv);
    blendedOutput = mix(color, previousFrame.rgb, 0.7);
    color = blendedOutput;

    gl_FragColor = vec4(color, 0.2);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}