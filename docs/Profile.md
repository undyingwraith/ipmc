# Profile

There are two types of profiles (internal, remote). The main difference being that the remote one connects to an already existing IPFS node, where as the internal one will spawn its own node.

## Common options

| Name | Description | Optional |
| - | - | - |
| id | A unique id. | ❌ |
| libraries | A list of libraries. For more info see [here](./library/README.md). | ❌ |
| name | Name of the profile that gets displayed in the app. | ❌ |

## Remote

| Name | Description | Optional |
| - | - | - |
| url | Url of the ipfs daemon api. | ❌ |

## Internal

| Name | Description | Optional |
| - | - | - |
| swarmKey | Swarm key used to connect to private networks. | ✅ |
| bootstrap | List of bootstrap addresses. A default list will be used if none are provided. | ✅ |
| port | Port of the node. Will use any available port if not set. | ✅ |
