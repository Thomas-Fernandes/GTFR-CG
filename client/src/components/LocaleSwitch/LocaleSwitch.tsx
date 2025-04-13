import { useDarkMode } from "@/common/hooks/useDarkMode/useDarkMode";
import { useLocale } from "@/common/hooks/useLocale/useLocale";
import { LOCALE_OPTIONS } from "@/common/l10n";
import { StateSetter } from "@/common/types";
import { ThemeType } from "@/components/DarkModeProvider/constants";
import SelectPopover from "@/components/SelectPopover/SelectPopover";
import { SvgPaths } from "@/constants/media";
import { useAppContext } from "@/contexts";

import "./LocaleSwitch.scss";

const LocaleSwitch = () => {
  const { intl } = useAppContext();
  const labels = {
    title: intl.formatMessage({ id: "components.localeSwitch.title" }),
  };

  const { isDarkMode } = useDarkMode();
  const { switchLocale } = useLocale();

  return (
    <SelectPopover
      title={labels.title}
      imgSrc={SvgPaths.LocaleCircle}
      options={LOCALE_OPTIONS}
      onSelect={switchLocale as StateSetter<string>}
      className={`locale-switch ${isDarkMode ? ThemeType.Dark : ThemeType.Light}`}
    />
  );
};

export default LocaleSwitch;
