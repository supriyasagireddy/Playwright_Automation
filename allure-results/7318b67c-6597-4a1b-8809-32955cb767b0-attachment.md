# Page snapshot

```yaml
- heading "This site can’t be reached" [level=1]
- paragraph: The connection was reset.
- paragraph: "Try:"
- list:
  - listitem: Checking the connection
  - listitem:
    - link "Checking the proxy and the firewall":
      - /url: "#buttons"
  - listitem:
    - link "Running Windows Network Diagnostics":
      - /url: javascript:diagnoseErrors()
- text: ERR_CONNECTION_RESET
- button "Reload"
- button "Details"
```