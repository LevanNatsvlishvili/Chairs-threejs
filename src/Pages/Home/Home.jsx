import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Section } from './Components/section';
import state from './Components/state';
import { useInView } from 'react-intersection-observer';

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

function Chair({ bgColor, position, modelPath, title, domContent }) {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.01));

  const [refItem, inView] = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      document.body.style.background = bgColor;
    }
  }, [inView, bgColor]);

  return (
    <Section offset={1} factor={1.5}>
      <group position={[0, position, 0]}>
        <mesh ref={ref} position={[0, -35, 0]}>
          <primitive object={modelPath.scene} dispose={null} />
        </mesh>
        <Html portal={domContent}>
          <div
            ref={refItem}
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
    </Section>
  );
}

function Home() {
  const [events] = useState();
  const domContent = useRef();
  const [models, setModels] = useState(null);

  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  useEffect(() => {
    const loadModels = async () => {
      const loader = new GLTFLoader();
      const blueModel = await loader.loadAsync('/armchair-blue/scene.gltf');
      const greyModel = await loader.loadAsync('/armchair-grey/scene.gltf');
      const pinkModel = await loader.loadAsync('/armchair-pink/scene.gltf');
      setModels([
        { path: blueModel, position: 250, bgColor: '#f15945', title: 'Blue' },
        { path: greyModel, position: 0, bgColor: '#571ec1', title: 'Grey' },
        { path: pinkModel, position: -250, bgColor: '#F2C649', title: 'Pink' },
      ]);
    };
    loadModels();
  }, []);

  console.log(models);

  return (
    <>
      {models ? (
        <>
          <Canvas camera={{ position: [0, 0, 120], fov: 70 }}>
            <Suspense>
              <Lights />
              {models &&
                models.map((model, index) => (
                  <Chair
                    key={index}
                    domContent={domContent}
                    modelPath={model.path}
                    position={model.position}
                    title={model.title}
                    bgColor={model.bgColor}
                  />
                ))}
            </Suspense>
          </Canvas>
        </>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div className="spinner"></div>
        </div>
      )}
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll} {...events}>
        <div style={{ position: 'sticky', top: 0 }} ref={domContent} />
        <div style={{ height: `calc(${state.sections} * 100vh)`, width: '100%' }} />
      </div>
    </>
  );
}

export default Home;
