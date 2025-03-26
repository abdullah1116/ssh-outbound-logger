# ssh-outbound-logger

### !! THIS README IS AI GENERATED AND NOT TESTED!!

Monitors and logs outbound SSH connections on a Linux system.

## Description

This script uses `lsof` to detect new outbound SSH connections (specifically to port 22, but configurable) and logs detailed information about them. It also uses `pstree` to capture the process tree of the SSH connection for better context. When an SSH connection terminates, it logs an exit event. This is useful for auditing and security monitoring of SSH connections initiated from a server.

## Features

- **Real-time Outbound SSH Monitoring:** Continuously monitors system processes using `lsof` to detect new outbound SSH connections, providing immediate visibility into connection attempts.
- **Detailed Connection Logging:** Logs extensive information for each detected SSH connection, including:
  - Process initiating the connection (`command`, `pid`, `user`).
  - Network connection details (`fd`, `type`, `device`, `node`, `name`).
  - Timestamped connection initiation and termination events.
- **Process Tree Context with `pstree`:** Captures the process tree of each SSH connection using `pstree`, revealing the ancestry of the process and aiding in understanding the context of the connection.
- **Unique Connection Tracking:** Assigns a UUIDv7 to each new connection, enabling consistent tracking of individual connections across logs from initiation to termination.
- **Configurable Polling Interval:** Allows customization of the monitoring frequency via the `SLEEP` environment variable, balancing real-time monitoring with system resource usage.
- **Log Rotation Included:** Provides a `logrotate` configuration file for automated log file management, preventing log files from consuming excessive disk space.
- **Systemd Service for Reliability:** Includes a `systemd` service file for easy deployment as a background service, ensuring continuous monitoring and automatic startup on system boot.

## Installation

### Prerequisites

- **Bun:** This script is designed to run with [Bun](https://bun.sh/), a fast JavaScript runtime. Ensure Bun is installed on your system. Follow the installation instructions on the official Bun website.
- **lsof:** The `lsof` (List Open Files) utility is essential for detecting open network connections. It is typically pre-installed on most Linux distributions. If not, install it using your distribution's package manager:
  - **Debian/Ubuntu:** `sudo apt update && sudo apt install lsof`
  - **CentOS/RHEL/Fedora:** `sudo yum install lsof` or `sudo dnf install lsof`
- **pstree:** The `pstree` utility is used to display process trees. It's also commonly pre-installed or easily installable:
  - **Debian/Ubuntu:** `sudo apt update && sudo apt install pstree`
  - **CentOS/RHEL/Fedora:** `sudo yum install pstree` or `sudo dnf install pstree`

### Installation Steps

1.  **Download or Clone:**

    - **Releases:** Download the latest release archive from the [Releases page](link-to-releases-page-if-available) (if you have releases set up on GitHub). Extract the archive to a directory of your choice, for example, `/opt/ssh-outbound-logger`.
    - **Clone from GitHub:**
      ```bash
      git clone <repository-url> /opt/ssh-outbound-logger
      cd /opt/ssh-outbound-logger
      ```

2.  **Install Dependencies:** Navigate to the installation directory (`/opt/ssh-outbound-logger` in the example) and install the project dependencies using Bun:

    ```bash
    cd /opt/ssh-outbound-logger
    bun install
    ```

    This command reads the `package.json` file and installs the necessary packages (currently, just types for Bun development, but it's good practice).

3.  **Configure `logrotate` (Optional but Recommended):**

    - Copy the `log-ssh-outbound.logrotate` file to `/etc/logrotate.d/`:
      ```bash
      sudo cp log-ssh-outbound.logrotate /etc/logrotate.d/
      ```
    - This configuration will rotate the logs daily, keep 7 days of history, compress old logs, and rotate them when they reach 10MB. Adjust the settings in `/etc/logrotate.d/log-ssh-outbound.logrotate` as needed.

4.  **Set up `systemd` Service (Recommended for Background Execution):**
    - Copy the `log-ssh-outbound.service` file to `/etc/systemd/system/`:
      ```bash
      sudo cp log-ssh-outbound.service /etc/systemd/system/
      ```
    - **Modify `log-ssh-outbound.service` (Important):** Edit `/etc/systemd/system/log-ssh-outbound.service` and adjust the `WorkingDirectory` and `ExecStart` paths to match your installation directory if you installed the script in a different location than `/opt/ssh-outbound-logger`. Ensure the `ExecStart` path correctly points to the `index.ts` file and uses `bun run`.
    - **Enable and Start the Service:**
      ```bash
      sudo systemctl enable log-ssh-outbound.service
      sudo systemctl start log-ssh-outbound.service
      ```
    - **Check Service Status:**
      ```bash
      sudo systemctl status log-ssh-outbound.service
      ```
      Ensure the service is active and running without errors. You can also check the service logs using `journalctl -u log-ssh-outbound.service`.

## Configuration

- **`SLEEP` Environment Variable:** You can control the polling interval (frequency of checking for new SSH connections) by setting the `SLEEP` environment variable. The value is in milliseconds and defaults to 50ms. To change it, you can:

  - **For the `systemd` service:** Edit the `log-ssh-outbound.service` file and add `Environment=SLEEP=1000` (for 1 second interval, for example) under the `[Service]` section. Then, reload the systemd configuration and restart the service:
    ```bash
    sudo systemctl daemon-reload
    sudo systemctl restart log-ssh-outbound.service
    ```
  - **For manual execution:** Run the script with the environment variable set:
    ```bash
    SLEEP=1000 bun run index.ts
    ```

- **SSH Port:** The script currently monitors outbound connections to port `22`. To monitor a different port, you need to modify the `lsof` command in the `helper.ts` file. Locate the line:
  ```typescript
  return await $`lsof -Pn -p ^1 -i :22`.text().catch(() => '');
  ```
