
import Card from '../card';


export default function CardBackend() {
  return (
    <Card>
        <h3>Backend and Sysadmin</h3>
        <p>This site is hosted on an <a href="https://ubuntu.com/server" rel="nofollow noreferrer" target="_blank" aria-label="Visit Ubuntu Linux Server website in a new tab">Ubuntu Linux</a> KVM running <a href="https://nginx.org/" rel="nofollow noreferrer" target="_blank" aria-label="Visit nginx website in a new tab">nginx</a>, and encrypted using <a href="https://letsencrypt.org/" rel="nofollow noreferrer" target="_blank" aria-label="Visit Let's Encrypt website in a new tab">Let&apos;s Encrypt</a> and <a href="https://certbot.eff.org/" rel="nofollow noreferrer" target="_blank" aria-label="Visit Certbot website in a new tab">Certbot</a>.</p>
        <p>I hand-configured every aspect of this, and ongoingly maintain it.</p>
    </Card>
  );
}

