import Image from "next/image";
import styles from "./CardBackend.module.css";

import Card from '../card';


export default function CardBackend() {
  return (
    <Card>
        <h3>Backend and Sysadmin</h3>
        <p>This site is hosted on an <a href="https://ubuntu.com/server" rel="nofollow noreferrer" target="_blank">Ubuntu Linux</a> KVM running <a href="https://nginx.org/" rel="nofollow noreferrer" target="_blank">nginx</a>, and encrypted using <a href="https://letsencrypt.org/" rel="nofollow noreferrer" target="_blank">Let's Encrypt</a> and <a href="https://certbot.eff.org/" rel="nofollow noreferrer" target="_blank">Certbot</a>.</p>
        <p>I hand-configured every aspect of this, and ongoingly maintain it.</p>
    </Card>
  );
}

