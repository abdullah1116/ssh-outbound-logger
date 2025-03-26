# ssh-outbound-logger

Monitors and logs outbound SSH connections on a Linux system.

## Description

This script uses `lsof` to detect new outbound SSH connections (specifically to port 22, but configurable) and logs detailed information about them. It also uses `pstree` to capture the process tree of the SSH connection for better context. When an SSH connection terminates, it logs an exit event. This is useful for auditing and security monitoring of SSH connections initiated from a server.

## Features

- **Real-time monitoring:** Continuously monitors for new outbound SSH connections.
- **Detailed logging:** Logs comprehensive information about each connection, including:
  - Process details (command, PID, user).
  - Connection details (file descriptor, type, device, node, name).
  - Process tree using `pstree`.
  - Unique UUID for each connection for tracking.
- **Connection lifecycle tracking:** Logs both connection initiation and termination events.
- **Log rotation:** Includes `logrotate` configuration for managing log file size.
- **Systemd service:** Provides a `systemd` service file for easy deployment and management.

## Installation

### Prerequisites

- **Bun:** [https://bun.sh/(https://bun.sh/) - Install Bun as the JavaScript runtime.
- **lsof:** Likely pre-installed on most Linux systems. If not, install it using your distribution's package manager (e.g., `apt install lsof` on Debian/Ubuntu, `yum install lsof` on CentOS/RHEL).
- **pstree:** Likely pre-installed or easily installable (e.g., `apt install pstree` or `yum install pstree`).

### Steps

1. **Clone or copy the files:** Copy `index.ts`, `helper.ts`, `log-ssh-outbound.logrotate`, `log-ssh-outbound.service`, and `package.json` to a directory on your server, for example `/opt/ssh-outbound-logger`.

2. **Install dependencies:** Navigate to the directory where you copied the files and run:

   ```bash
   bun install
   ```
