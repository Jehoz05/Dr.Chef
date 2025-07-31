"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NavLink from "./nav-link";

import logoImg from "@/assets/chef.png";
import classes from "./main-header.module.css";
import MainHeaderBackground from "./main-header-background";

export default function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuHandler = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link className={classes.logo} href="/">
          <Image src={logoImg} alt="A plate with food on it" priority />
          Dr.Chef
        </Link>

        <button
          className={classes.menuToggle}
          onClick={toggleMenuHandler}
          aria-label="Toggle navigation"
        >
          <span className={classes.bar}></span>
          <span className={classes.bar}></span>
          <span className={classes.bar}></span>
        </button>

        <nav
          className={`${classes.nav} ${menuOpen ? classes.open : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <ul>
            <li>
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Foodies Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
