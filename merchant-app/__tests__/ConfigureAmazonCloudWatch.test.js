import { ConfigureAmazonCloudWatch } from "../src/utils/ConfigureAmazonCloudWatch";
import { render, fireEvent } from "@testing-library/react";
let ENV_KEY = process.env.NEXT_PUBLIC_ENV_KEY;

test("can load a script", () => {
  const handler = jest.fn();
  render(<script src={ConfigureAmazonCloudWatch[ENV_KEY]} />);
  const script = document.querySelector("script");
  script.onload = handler;
  expect(handler).not.toHaveBeenCalled();
  fireEvent.load(script);
  expect(handler).toHaveBeenCalled();
});
