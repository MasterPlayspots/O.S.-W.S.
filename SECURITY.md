# Security and private data

Supported boundary: one authorized operator on a trusted local host. HTTP binds to 127.0.0.1. Local session, Host/Origin checks, CSP, bounded inputs and a closed action catalog are present. These are not multi-user authentication or certification.

Keep runtime profiles and memory/config files outside the repo. Ignore rules exclude common private folders, environment files and key files; they do not guarantee leak prevention. The memory adapter reads the file you explicitly bind. It refuses symlinks and files over 1 MiB but does not classify every secret in prose. Source content is untrusted data, never system instructions.

The Git reader excludes selected sensitive filenames/patterns, restricts the root and checks optional writes against a base hash. This is not comprehensive DLP. The bridge imports structured metadata, not raw chats. Memory exports contain the selected content; review before sharing. Hashes describe observed bytes, not source truth/authenticity.

Public/team hosting needs separate authentication, authorization, TLS, tenant isolation, audit, backup and incident handling. No public reverse proxy or team account system is supplied.

If a credential may have leaked, revoke/rotate it at the issuer first, update legitimate private runtime configuration and assess history/forks/caches. Deleting a line or changing visibility does not revoke a key. Never paste suspected secrets into public issues. Use GitHub private vulnerability reporting if enabled, or the maintainer's established private channel; availability of that feature is not promised here.
