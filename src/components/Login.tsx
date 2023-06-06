"use client";
import React, { useCallback, useMemo } from "react";
import css from "@/styles/Login.module.scss";
import { Form, Button, Icon } from "semantic-ui-react";
import Input from "./Input";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Engine, IOptions, RecursivePartial } from "tsparticles-engine";

const ParticlesComponent = () => {
  // using useMemo is not mandatory, but it's recommended since this value can be memoized if static
  const options: RecursivePartial<IOptions> = useMemo(() => {
    return {
      fullScreen: {
        enable: true,
        zIndex: 0,
      },
      interactivity: {
        events: {
          onClick: {
            enable: true, // enables the click event
            mode: "push", // adds the particles on click
          },
          onHover: {
            enable: true, // enables the hover event
            mode: "repulse", // make the particles run away from the cursor
          },
        },
        modes: {
          push: {
            quantity: 10, // number of particles to add on click
          },
          repulse: {
            distance: 20, // distance of the particles from the cursor
          },
        },
      },
      particles: {
        links: {
          enable: false, // enabling this will make particles linked together
          distance: 100, // maximum distance for linking the particles
        },
        move: {
          enable: true, // enabling this will make particles move in the canvas
          speed: { min: 1, max: 5 }, // using a range in speed value will make particles move in a random speed between min/max values, each particles have its own value, it won't change in time by default
        },
        opacity: {
          value: { min: 0.3, max: 0.7 }, // using a different opacity, to have some semitransparent effects
        },
        size: {
          value: { min: 1, max: 5 }, // let's randomize the particles size a bit
        },
      },
    };
  }, []);

  // useCallback is not mandatory, but it's recommended since this callback can be memoized if static
  const particlesInit = useCallback((engine: Engine) => {
    loadSlim(engine);
    // loadFull(engine); // for this sample the slim version is enough, choose whatever you prefer, slim is smaller in size but doesn't have all the plugins and the mouse trail feature
  }, []);

  // setting an id can be useful for identifying the right particles component, this is useful for multiple instances or reusable components
  return (
    <Particles
      id={"tsparticles"}
      init={particlesInit as any}
      options={options}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

const Login = () => {
  return (
    <>
      <section className={css.login}>
        <div className={css.modal}>
          <h1>LOGIN</h1>
          <Form className={css.form}>
            <Input
              placeholder="Username"
              value=""
              label="Username"
              onBlur={() => {}}
              onChange={() => {}}
              id="username"
              type="text"
              name="username"
              icon="fa-regular fa-user"
            />
            <Input
              placeholder="Password"
              value=""
              label="Password"
              onBlur={() => {}}
              onChange={() => {}}
              id="pasword"
              type="password"
              name="password"
              icon="icon lock"
            />
            <div className={css["btn-container"]}>
              <Button animated className={css.btn}>
                <Button.Content visible>Login</Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow right" />
                </Button.Content>
              </Button>
            </div>
          </Form>
        </div>
      </section>
      <ParticlesComponent />
    </>
  );
};

export default Login;
