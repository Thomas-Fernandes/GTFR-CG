from server.src.constants.enums import AvailableStats
from server.src.typing_gtfr import JsonDict

EMPTY_STATS: JsonDict = {
    AvailableStats.DATE_FIRST_OPERATION: "N/A",
    AvailableStats.DATE_LAST_OPERATION: "N/A",
    AvailableStats.ARTWORK_GENERATIONS: 0,
    AvailableStats.LYRICS_FETCHES: 0,
    AvailableStats.CARDS_GENERATED: 0,
}

INCREMENTABLE_STATS: list[str] = [
    AvailableStats.ARTWORK_GENERATIONS,
    AvailableStats.LYRICS_FETCHES,
    AvailableStats.CARDS_GENERATED,
]
