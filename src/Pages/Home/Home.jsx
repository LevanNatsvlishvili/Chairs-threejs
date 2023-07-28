import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Section } from './Components/section';
import state from './Components/state';
import { useInView } from 'react-intersection-observer';

const Model = ({ path }) => {
  const gltf = useLoader(GLTFLoader, `/${path}/scene.gltf`);
  return <primitive object={gltf.scene} dispose={null} />;
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

function Chair({ bgColor, position, modelPath, title, domContent }) {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.01));

  const [refItem, inView] = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView]);

  return (
    <Section offset={1} factor={1.5}>
      <group position={[0, position, 0]}>
        <mesh ref={ref} position={[0, -35, 0]}>
          <Model path={modelPath} />
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
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  return (
    <>
      {/* R3F Canvas */}
      <Canvas concurrent colorManagement camera={{ position: [0, 0, 120], fov: 70 }}>
        <Suspense>
          {/* Lights Component */}
          <Lights />
          <Chair domContent={domContent} modelPath="armchair-blue" position={250} title="Blue" bgColor={'#f15945'} />
          <Chair domContent={domContent} modelPath="armchair-grey" position={0} title="Grey" bgColor={'#571ec1'} />
          <Chair domContent={domContent} modelPath="armchair-pink" position={-250} title="Pink" bgColor={'#F2C649 '} />
        </Suspense>
      </Canvas>
      <div className="scrollArea" ref={scrollArea} onScroll={onScroll} {...events}>
        <div style={{ position: 'sticky', top: 0 }} ref={domContent} />
        <div style={{ height: `calc(${state.sections} * 100vh)`, width: '100%' }} />
      </div>
    </>
  );
}

export default Home;
