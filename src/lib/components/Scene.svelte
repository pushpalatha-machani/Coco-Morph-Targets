<script lang="ts">
  import { T, extend, useThrelte, useTask } from '@threlte/core';
  import { Environment, OrbitControls, useGltf } from '@threlte/extras';
  import * as THREE from 'three';

  extend(THREE);

  const { invalidate } = useThrelte();

  export let faceSettings: Record<string, number> = {};
  export let playbackSpeed: number = 0;

  const gltf = useGltf('/coco.glb');

  // specific camera by name
  $: camera002 = $gltf?.cameras.find((c) => c.name === 'Camera002') as THREE.PerspectiveCamera;

  let animationMixer: THREE.AnimationMixer | undefined;
  let faceMeshes: THREE.Mesh[] = [];

  $: if ($gltf) {
    const robotRoot = $gltf.scene;
    // Initialize Animations
    animationMixer = new THREE.AnimationMixer(robotRoot);
    $gltf.animations.forEach((clip: THREE.AnimationClip) => {
      animationMixer?.clipAction(clip).play();
    });

    // morph targets
    faceMeshes = [];
    robotRoot.traverse((node: THREE.Object3D) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh && mesh.morphTargetInfluences) {
        faceMeshes.push(mesh);
      }
    });
  }

  useTask((delta: number) => {
    if (animationMixer && playbackSpeed > 0) {
      animationMixer.update(delta * playbackSpeed);
      invalidate();
    }
  });

  $: if (faceMeshes.length > 0 && faceSettings) {
    for (const mesh of faceMeshes) {
      for (const [name, value] of Object.entries(faceSettings)) {
        const dictionary = mesh.morphTargetDictionary;
        if (dictionary) {
          const muscleIndex = dictionary[name];
          if (muscleIndex !== undefined) {
            mesh.morphTargetInfluences![muscleIndex] = value;
          }
        }
      }
    }
    invalidate();
  }
</script>

{#if camera002}
  <T is={camera002} makeDefault>
    <OrbitControls enableDamping target={[0, 0.7, 0]} />
  </T>
{/if}

<Environment
  path="https://raw.githubusercontent.com/pmndrs/drei-assets/master/"
  files="reid_free_area_1k.hdr"
/>

<T.AmbientLight intensity={1} />
<T.DirectionalLight position={[5, 10, 5]} intensity={2} />

{#if $gltf}
  <T is={$gltf.scene} />
{/if}