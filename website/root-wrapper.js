import { MDXProvider } from '@mdx-js/react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Helmet } from 'react-helmet';
import CodePen from './src/components/CodePen';
import Docs from './src/components/Docs';
import Blog from './src/components/Blog';
import Post from './src/components/Post';
import Standalone from './src/components/Standalone';
import Editor from './src/components/Editor';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from './src/components/Heading';
import { Script } from 'gatsby';

const components = {
  CodePen,
  Editor,
  More: () => <div style={{ display: 'none' }}>{/* more */}</div>,
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  pre: ({ children }) => {
    const className = children.props.className || '';
    const matches = className.match(/language-(?<lang>.*)/);
    return (
      <Highlight
        {...defaultProps}
        code={children.props.children}
        language={
          matches && matches.groups && matches.groups.lang
            ? matches.groups.lang
            : ''
        }
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            <code>
              {tokens.map((line, i) =>
                i === tokens.length - 1 &&
                line[0].empty &&
                line.length === 1 ? null : (
                  <div {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                ),
              )}
            </code>
          </pre>
        )}
      </Highlight>
    );
  },
};

export const wrapRootElement = ({ element, props }) => {
  const title = props.pageContext.frontmatter?.title;
  const layout = props.pageContext.frontmatter?.layout;

  return (
    <>
      <MDXProvider components={components}>
        {title && (
          <Helmet>
            <title>{title} - Quill Rich Text Editor</title>
          </Helmet>
        )}
        {layout !== 'standalone' && (
          <Helmet>
            <link
              type="text/css"
              rel="stylesheet"
              href="/assets/css/styles.css"
            />
          </Helmet>
        )}
        {(() => {
          if (layout === 'docs') {
            return <Docs {...props.pageContext.frontmatter}>{element}</Docs>;
          }
          if (layout === 'blog') {
            return <Blog {...props.pageContext.frontmatter}>{element}</Blog>;
          }
          if (layout === 'post') {
            return <Post {...props.pageContext.frontmatter}>{element}</Post>;
          }
          if (layout === 'standalone') {
            return (
              <Standalone {...props.pageContext.frontmatter}>
                {element}
              </Standalone>
            );
          }
          // props provide same data to Layout as Page element will get
          // including location, data, etc - you don't need to pass it
          return element;
        })()}
      </MDXProvider>
      <Script>{`
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-19077541-2', 'auto');
      ga('send', 'pageview');
      `}</Script>
    </>
  );
};
