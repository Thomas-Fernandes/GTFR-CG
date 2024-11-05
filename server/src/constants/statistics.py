from server.src.constants.enums import AvailableStats
from server.src.typing_gtfr import JsonDict

EMPTY_STATS: JsonDict = {
    AvailableStats.dateFirstOperation: "N/A",
    AvailableStats.dateLastOperation: "N/A",
    AvailableStats.artworkGenerations: 0,
    AvailableStats.lyricsFetches: 0,
    AvailableStats.cardsGenerated: 0,
}
INCREMENTABLE_STATS: list[str] = [
    AvailableStats.artworkGenerations,
    AvailableStats.lyricsFetches,
    AvailableStats.cardsGenerated,
]
