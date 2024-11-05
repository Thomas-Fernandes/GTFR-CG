from server.src.constants.enums import AvailableStats
from server.src.typing_gtfr import JsonDict

EMPTY_STATS: JsonDict = {
    AvailableStats.dateFirstOperation.value: "N/A",
    AvailableStats.dateLastOperation.value: "N/A",
    AvailableStats.artworkGenerations.value: 0,
    AvailableStats.lyricsFetches.value: 0,
    AvailableStats.cardsGenerated.value: 0,
}
INCREMENTABLE_STATS: list[str] = [
    AvailableStats.artworkGenerations.value,
    AvailableStats.lyricsFetches.value,
    AvailableStats.cardsGenerated.value,
]
