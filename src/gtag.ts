export const GA_TRACKING_ID = "G-WMX1SG4BKT";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  // eslint-disable-next-line @typescript-eslint/ban-types
  action: Gtag.EventNames | (string & {});
  category: string | undefined;
  label: string | undefined;
  value: number | undefined;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
