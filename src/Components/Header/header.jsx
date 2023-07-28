import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <header>
        <div className="header-inner">
          <div className="logo">CHAIR.</div>
          <nav>
            <ul>
              <li className="btn">
                <Link to="/product">order</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
}
