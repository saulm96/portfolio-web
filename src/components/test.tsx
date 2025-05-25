import TypedAnimatedText from "./TypingAnimatedText/TypedAnimatedText";

function MinimalTest() {
  return (
    <>
      <p>Test 1:</p>
      <TypedAnimatedText text="Haz click aquí para empezar" typingSpeed={100} />
      <hr />
      <p>Test 2 (short string):</p>
      <TypedAnimatedText text="Test" typingSpeed={100} />
      <hr />
      <p>Test 3 (empty string):</p>
      <TypedAnimatedText text="" typingSpeed={100} />
    </>
  );
}

export default MinimalTest;