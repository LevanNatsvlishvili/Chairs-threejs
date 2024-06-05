import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap } from 'gsap';

const Model = ({ path }) => {
  const ref = useRef();
  console.log(path);
  useEffect(() => {
    gsap.to(ref.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5,
    });
  }, [path]);

  return (
    <mesh ref={ref} scale={0}>
      <primitive object={path.scene} dispose={null} />
    </mesh>
  );
};

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={0.5} />
      <spotLight intensity={0.2} position={[0, 1000, 0]} />
    </>
  );
};

function Chair({ bgColor, position, modelPath, title }) {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.01));

  return (
    <group position={[0, position, 0]}>
      <mesh ref={ref} position={[0, -35, 0]}>
        <Model path={modelPath} />
      </mesh>
      <Html>
        <div
          style={{
            height: '100%',
            display: 'flex',
            color: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '2rem',
            transform: 'translateX(-50%)',
            left: '-50%',
            marginTop: -50,
          }}
          className="container"
        >
          <h1 style={{ color: bgColor }}>{title}</h1>
        </div>
      </Html>
    </group>
  );
}

const chairs = [
  { modelPath: 'armchair-blue', title: 'Blue', bgColor: '#f15945' },
  { modelPath: 'armchair-grey', title: 'Grey', bgColor: '#571ec1' },
  { modelPath: 'armchair-pink', title: 'Pink', bgColor: '#F2C649' },
];

function Product() {
  const [curr, setCurr] = useState({
    modelPath: 'armchair-pink',
    title: 'Pink',
    bgColor: '#F2C649',
  });

  const handleClick = () => {
    const indexOf = chairs.indexOf(curr);
    if (indexOf === 2) {
      setCurr(chairs[0]);
      return;
    }
    setCurr(chairs[indexOf + 1]);
  };

  const [models, setModels] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      const loader = new GLTFLoader();
      const blueModel = await loader.loadAsync('/armchair-blue/scene.gltf');
      const greyModel = await loader.loadAsync('/armchair-grey/scene.gltf');
      const pinkModel = await loader.loadAsync('/armchair-pink/scene.gltf');
      setModels({
        'armchair-blue': blueModel,
        'armchair-grey': greyModel,
        'armchair-pink': pinkModel,
      });
    };
    loadModels();
  }, []);

  console.log(models);

  return (
    <>
      {models ? (
        <Canvas camera={{ position: [0, 0, 120], fov: 70 }}>
          <Suspense fallback={<div className="spinner"></div>}>
            <Lights />
            {!!models && <Chair position={0} {...curr} modelPath={models[curr.modelPath]} />}
          </Suspense>
        </Canvas>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="spinner"></div>
        </div>
      )}
      <div>
        <button className="btn product-change-btn" onClick={handleClick}>
          Choose
        </button>
      </div>
    </>
  );
}

export default Product;
