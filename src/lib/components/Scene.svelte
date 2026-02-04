<script lang="ts">
  import { T, extend, useThrelte, useTask } from '@threlte/core';
  import { Environment, OrbitControls, useGltf } from '@threlte/extras';
  import * as THREE from 'three';
  import { browser } from '$app/environment';

  extend(THREE);
  const { invalidate } = useThrelte();

  // Props
  export let faceSettings: Record<string, number> = {};
  export let playbackSpeed: number = 0;
  export let meshColor: string = "pink-500"; 

  function resolveColor(name: string): string {
    if (!browser) return '#ffffff';
    const varName = `--tw-color-${name}`;
    const hex = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (hex) return hex;
    const fallbackHex = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
    return fallbackHex || name;
  }

  const gltf = useGltf('/coco.glb');
  let animationMixer: THREE.AnimationMixer | undefined;
  let faceMeshes: THREE.Mesh[] = [];

  // Reactive Colors
  $: if ($gltf && meshColor) {
    const finalColor = resolveColor(meshColor);
    $gltf.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (!obj.userData.cloned) {
          obj.material = obj.material.clone();
          obj.userData.cloned = true;
        }
        obj.material.color.set(finalColor);
      }
    });
    invalidate();
  }

  // Initial Setup: Animations
  $: if ($gltf && !animationMixer) {
    animationMixer = new THREE.AnimationMixer($gltf.scene);
    $gltf.animations.forEach((clip) => animationMixer?.clipAction(clip).play());
    faceMeshes = [];
    $gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && node.morphTargetInfluences) {
        faceMeshes.push(node);
      }
    });
  }

  // Loop
  useTask((delta) => {
    if (animationMixer && playbackSpeed > 0) {
      animationMixer.update(delta * playbackSpeed);
      invalidate();
    }
  });

  // Reactive Face Sliders
  $: if (faceMeshes.length > 0 && faceSettings) {
    for (const mesh of faceMeshes) {
      const dict = mesh.morphTargetDictionary;
      if (dict) {
        for (const [name, value] of Object.entries(faceSettings)) {
          const index = dict[name];
          if (index !== undefined) mesh.morphTargetInfluences![index] = value;
        }
      }
    }
    invalidate();
  }
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 120]} fov={5}>
  <OrbitControls enableDamping target={[0, 17, 0]} />
</T.PerspectiveCamera>

<Environment
  path="https://raw.githubusercontent.com/pmndrs/drei-assets/master/"
  files="reid_free_area_1k.hdr"
/>

<T.AmbientLight intensity={1} />
<T.DirectionalLight position={[5, 10, 5]} intensity={2} />

{#if $gltf}
  <T is={$gltf.scene} scale={20} position={[0, 0, 0]} />
{/if}