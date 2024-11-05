ATTRIBUTION_PERCENTAGE_TOLERANCE = 5 # if user_attr < ATTRIBUTION_TOLERANCE, don't display them on outro card

METADATA_IDENTIFIER = "Metadata | "
METADATA_SEP = " ;;; "

TRANSLATION_TABLE = {
    ord('\u2005'): ' ', # Replace four-per-em space with normal space
    ord('\u200b'): '', # Replace zero-width space with nothing
    ord('\u0435'): 'e', # Replace Cyrillic 'е' with Latin 'e'
}