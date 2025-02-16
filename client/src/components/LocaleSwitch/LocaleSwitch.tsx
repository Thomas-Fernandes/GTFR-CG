import { useDarkMode } from "@/common/hooks/useDarkMode/useDarkMode";
import { useLocale } from "@/common/hooks/useLocale/useLocale";
import { LOCALE_OPTIONS } from "@/common/i18n";
import { StateSetter } from "@/common/types";
import { ThemeType } from "@/components/DarkModeProvider/constants";
import SelectPopover from "@/components/SelectPopover/SelectPopover";
import { useAppContext } from "@/contexts";

import "./LocaleSwitch.scss";

const LocaleSwitch: React.FC = () => {
  const { intl } = useAppContext();
  const labels = {
    title: intl.formatMessage({ id: "components.localeSwitch.title" }),
  };

  const { isDarkMode } = useDarkMode();
  const { setLocale } = useLocale();

  return (
    <SelectPopover
      title={labels.title}
      options={LOCALE_OPTIONS}
      onSelect={setLocale as StateSetter<string>}
      className={`locale-switch ${isDarkMode ? ThemeType.Dark : ThemeType.Light}`}
      imgSrc={"/svg/locale-circle.svg"}
    />
  );
};

export default LocaleSwitch;
