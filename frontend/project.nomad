job "adrift" {
    datacenters = ["dc1"]

    group "adrift" {
        count = 1

        network {
            port "http"  {
                to = 80
            }
        }

        update {
            canary       = 1
            max_parallel = 3
            auto_revert  = true
            auto_promote = true
        }

        service {
            name = "adrift"
            port = "http"
            provider = "nomad"

            tags = [
                "traefik.enable=true",
                "traefik.http.routers.adrift.rule=Host(`adrift-example.com`)",
            ]
        }

        task "adrift" {
            driver = "docker"

            config {
                image = "${CI_REGISTRY}/hmerritt/adrift:${CI_COMMIT_TAG}"
                ports = ["http"]

                auth {
                    username = "${CI_REGISTRY_USER}"
                    password = "${PERSONAL_ACCESS_TOKEN}"
                }
            }
        }
    }
}
