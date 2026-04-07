"""FastAPI server for the Logistics Shipment RL Environment."""

try:
    from openenv.core.env_server.http_server import create_app
    from .environment import LogisticsShipmentEnvironment, LogisticsAction, LogisticsObservation
except ImportError:
    from openenv.core.env_server.http_server import create_app
    from server.environment import LogisticsShipmentEnvironment, LogisticsAction, LogisticsObservation

app = create_app(
    LogisticsShipmentEnvironment,
    LogisticsAction,
    LogisticsObservation,
    env_name="logistics_shipment_env",
)


def main():
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
