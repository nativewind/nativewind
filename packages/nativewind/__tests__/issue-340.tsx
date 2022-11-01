import { render } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { styled } from "../src";

const StyledView = styled(View);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PostCard = ({ post }: any) => {
  return (
    <StyledView className="color-slate">
      <Text>{post.title}</Text>
      <Text>{post.content}</Text>
    </StyledView>
  );
};

describe("<HomeScreen />", () => {
  it("<PostCard /> exists", () => {
    const { container } = render(
      <PostCard post={{ id: "1234", title: "yes", content: "woo" }} />
    );
    expect(container).toBeTruthy();
  });
});
